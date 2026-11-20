export interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, any>;
  style?: Record<string, string>;
  children?: ComponentInstance[];
  slots?: {
    [key: string]: ComponentInstance[] | undefined;
  };
}

export interface ComponentConfig {
  type: string;
  name: string;
  premium?: boolean;
  defaultProps: Record<string, any>;
  defaultStyle?: Record<string, string>;
  propsConfig?: PropFieldConfig[];
  styleConfig?: StyleFieldConfig[];
}

export interface PropFieldConfig {
  key: string;
  label: string;
  type: 'input' | 'select' | 'number' | 'textarea';
  options?: string[];
}

export interface StyleFieldConfig {
  key: string;
  label: string;
  type: 'input' | 'number' | 'select';
  options?: string[];
}