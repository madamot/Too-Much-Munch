import React from 'react';

import Footer from './footer';

export default {
  title: 'Footer',
  component: Footer,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Footer  />;

export const Primary = Template.bind({});
