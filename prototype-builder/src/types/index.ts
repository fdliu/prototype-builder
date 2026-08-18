export interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, any>;
  style?: Record<string, string>;
  children?: ComponentInstance[];
  slots?: {
    header?: ComponentInstance[];
    sidebar?: ComponentInstance[];
    content?: ComponentInstance[];
    footer?: ComponentInstance[];
    [key: string]: ComponentInstance[] | undefined;
  };
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
  
  export interface PropFieldConfig {
    key: string;
    label: string;
    type: 'input' | 'select' | 'number' | 'textarea';
    options?: string[];
  }