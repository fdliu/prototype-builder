import BaseButton from './BaseButton.vue';
import BaseInput from './BaseInput.vue';
import BaseTable from './BaseTable.vue';
import BaseForm from './BaseForm.vue';
import BaseCard from './BaseCard.vue';
import BaseDialog from './BaseDialog.vue';
import BaseLayout from './BaseLayout.vue';
import BaseGrid from './BaseGrid.vue';

export const componentMap: Record<string, any> = {
  button: BaseButton,
  input: BaseInput,
  table: BaseTable,
  form: BaseForm,
  card: BaseCard,
  dialog: BaseDialog,
  layout: BaseLayout,
  grid: BaseGrid,
};

export function getRenderer(type: string) {
  return componentMap[type] || 'div';
}