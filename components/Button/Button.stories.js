import React from 'react';

import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    // primary: { control: 'color' },
  },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  size: 'large',
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  primary: false,
  label: 'Button',
  size: 'large',
};

export const Large = Template.bind({});
Large.args = {
  primary: false,
  size: 'large',
  label: 'Button',
};

export const Medium = Template.bind({});
Medium.args = {
  primary: false,
  size: 'medium',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  primary: false,
  size: 'small',
  label: 'Button',
};
