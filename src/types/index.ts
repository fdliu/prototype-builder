export interface ComponentInstance {
    id: string;
    type: string;
    props: Record<string, any>;
    style?: Record<string, string>;
    children?: ComponentInstance[];
  }
  
  export interface ComponentConfig {
    type: string;
    name: string;
    defaultProps: Record<string, any>;
    propsConfig?: PropFieldConfig[];
  }
  
  export interface PropFieldConfig {
    key: string;
    label: string;
    type: 'input' | 'select' | 'number' | 'textarea';
    options?: string[];
  }