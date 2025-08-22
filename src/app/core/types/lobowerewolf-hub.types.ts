export type Tool = {
  name: string;
  title: string;
  icon: string;
  visible: boolean;
  order?: number;
  button: boolean;
  toggle?: boolean;
  onClick?: () => void;
  onChange?: () => void;
};
