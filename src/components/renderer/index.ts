import BaseButton from './BaseButton.vue';
import BaseInput from './BaseInput.vue';
import BaseTable from './BaseTable.vue';
import BaseForm from './BaseForm.vue';
import BaseCard from './BaseCard.vue';
import BaseDialog from './BaseDialog.vue';
import BaseLayout from './BaseLayout.vue';
import BaseGrid from './BaseGrid.vue';
import BaseText from './BaseText.vue';
import BaseSelect from './BaseSelect.vue';
import BaseIcon from './BaseIcon.vue';
import BaseLink from './BaseLink.vue';
import BaseRadio from './BaseRadio.vue';
import BaseCheckbox from './BaseCheckbox.vue';

export const componentMap: Record<string, any> = {
  layout: BaseLayout,
  grid: BaseGrid,
  text: BaseText,
  link: BaseLink,
  button: BaseButton,
  input: BaseInput,
  select: BaseSelect,
  radio: BaseRadio,
  checkbox: BaseCheckbox,
  table: BaseTable,
  form: BaseForm,
  card: BaseCard,
  dialog: BaseDialog,
  icon: BaseIcon,
};

export function getRenderer(type: string) {
  return componentMap[type] || 'div';
}