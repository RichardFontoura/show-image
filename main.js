Hooks.on("init", () => {
  console.log(game.i18n.localize("module_start"));

  const style = `
  <style>
    .my-multi-image-dialog .window-content {
      width: auto !important;
      max-width: 900px;
      min-width: 500px;
    }

    .multi-image-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 15px;
      width: 100%;
    }

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .row.input-row input[type="text"] {
      flex: 0 0 auto;
      width: 100%;
      min-width: 350px;
      height: 28px;
      line-height: 28px;
    }

    .row.input-row button#btn-add-image {
      margin-left: auto;
      flex: 0 0 auto;
      font-size: 0.9em;
      padding: 2px 8px;
      height: 28px;
      line-height: 28px;
      min-width: 70px;
    }

    #images-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      border: 1px solid #ccc;
      padding: 5px;
      max-height: 200px;
      overflow-y: auto;
    }

    .image-box {
      display: grid;
      grid-template-columns: auto 1fr auto; 
      align-items: center;
      gap: 10px;
      border: 1px solid #ddd;
      padding: 4px;
      min-height: 60px;
    }

    .image-box > span {
      font-weight: bold;
    }

    .image-box div {
      display: flex;
      align-items: center;
      justify-content: center; 
      gap: 6px;
      overflow: hidden;
    }

    .image-link {
      display: inline-block;
      font-size: 0.9em;
      color: #555;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
    }

    .btn-remove-image {
      background: transparent;
      border: none;
      color: red;
      cursor: pointer;
      font-weight: bold;
      justify-self: end;   
      
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: 14px;
    }

    .thumb-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border: 1px solid #ccc;
      margin-right: 6px;
    }
  </style>
  `;

  document.head.insertAdjacentHTML("beforeend", style);
});

Hooks.on("getSceneControlButtons", (controls) => {
  const tokenControls = controls.find(c => c.name === "token");
  if (!tokenControls) return;

  const showImageButton = {
    name: "showImageButton",
    title: "Show Image",
    icon: "fa-solid fa-image",
    toggle: true,
    visible: game.user.isGM,
    active: false,
    onClick: (toggled) => {
      if (toggled) {
        const userOptions = game.users.contents
          .map(user => `<option value="${user.id}">${user.name}</option>`)
          .join("");

        const contentHtml = `
                <div class="multi-image-container">
                  <!-- Linha para selecionar usuário -->
                  <div class="row">
                    <label for="user-select" style="white-space: nowrap;">
                      ${game.i18n.localize("select_user")}
                    </label>
                    <select id="user-select">${userOptions}</select>
                    <button id="btn-add-image">
                      ${game.i18n.localize("add_image")}
                    </button>
                  </div>

                  <!-- Linha para inserir link -->
                  <div class="row input-row">
                    <input type="text" id="image-url"
                           placeholder="${game.i18n.localize("insert_image")}" />
                  </div>

                  <!-- Container para exibir as imagens adicionadas -->
                  <div id="images-list"></div>

                  <!-- Linha com botões de envio -->
                  <div class="row">
                    <button id="btn-show-image">
                      ${game.i18n.localize("send_image")}
                    </button>
                    <button id="btn-show-all">
                      ${game.i18n.localize("show_all")}
                    </button>
                  </div>
                </div>
              `;

        const dialog = new Dialog({
          title: game.i18n.localize("show_image"),
          content: contentHtml,
          buttons: {
            close: {
              label: game.i18n.localize("close"),
              callback: () => console.log(game.i18n.localize("image_close"))
            }
          },
          default: "close",
          render: (html) => {
            const imageLinks = [];

            function refreshImagesList() {
              const container = html.find("#images-list");
              container.empty();

              imageLinks.forEach((link, index) => {
                const box = $(`
                                  <div class="image-box">
                                      <span>${game.i18n.localize("image")} ${index + 1}</span>
                                      <div style="display: flex; gap: 6px; align-items: center;">
                                          <img src="${link}" class="thumb-image" />
                                          <span class="image-link">${link}</span>
                                      </div>
                                      <button class="btn-remove-image" data-index="${index}">X</button>
                                  </div>
                              `);
                container.append(box);
              });

              dialog.setPosition({ width: "auto", height: "auto" });
            }

            html.find("#btn-add-image").click(() => {
              const input = html.find("#image-url");
              const link = input.val().trim();
              if (!link) {
                ui.notifications.error(game.i18n.localize("image_link_error"));
                return;
              }
              imageLinks.push(link);
              input.val("");
              refreshImagesList();
            });

            html.find("#image-url").keydown((e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                html.find("#btn-add-image").click();
                return false;
              }
            });

            html.find("#image-url").on("paste", function (e) {
              const clipboardData = (e.originalEvent || e).clipboardData;
              if (!clipboardData) return;
              const items = clipboardData.items;
              for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.indexOf("image") !== -1) {
                  const blob = item.getAsFile();
                  const reader = new FileReader();
                  reader.onload = function (event) {
                    const dataUrl = event.target.result;
                    imageLinks.push(dataUrl);
                    refreshImagesList();
                  };
                  reader.readAsDataURL(blob);
                  e.preventDefault();
                  return false;
                }
              }
            });

            html.find("#image-url").on("dragover", function (e) {
              e.preventDefault();
            });
            html.find("#image-url").on("drop", function (e) {
              e.preventDefault();
              const dt = e.originalEvent.dataTransfer;
              if (dt && dt.files && dt.files.length) {
                const file = dt.files[0];
                if (file.type.indexOf("image") !== -1) {
                  const reader = new FileReader();
                  reader.onload = function (event) {
                    const dataUrl = event.target.result;
                    imageLinks.push(dataUrl);
                    refreshImagesList();
                  };
                  reader.readAsDataURL(file);
                }
              }
            });

            html.on("click", ".btn-remove-image", function () {
              const index = $(this).data("index");
              imageLinks.splice(index, 1);
              refreshImagesList();
            });

            html.find("#btn-show-image").click(() => {
              const selectedUserId = html.find("#user-select").val();
              if (imageLinks.length === 0) {
                ui.notifications.error(game.i18n.localize("no_image_to_send"));
                return;
              }
              const imagesHtml = imageLinks.map((link, idx) =>
                `<div>
                                <strong>${game.i18n.localize("image")} ${idx + 1}:</strong><br>
                                <img src="${link}" style="max-width:100%; height:auto;">
                              </div>`
              ).join("");
              ChatMessage.create({
                content: imagesHtml,
                whisper: [selectedUserId]
              });
            });

            html.find("#btn-show-all").click(() => {
              if (imageLinks.length === 0) {
                ui.notifications.error(game.i18n.localize("no_image_to_send"));
                return;
              }
              imageLinks.forEach(link => {
                const popout = new ImagePopout(link, {
                  title: game.i18n.localize("image"),
                  shareable: true
                });
                popout.render(true);
                popout.shareImage();
              });
            });
          }
        }, {
          classes: ["my-multi-image-dialog"],
          width: "auto",
          height: "auto",
          resizable: false
        });

        dialog.render(true);
        showImageButton.active = false;
      } else {
        ui.notifications.warn(game.i18n.localize("button_deactivated"));
      }
    }
  };

  tokenControls.tools.push(showImageButton);
});
