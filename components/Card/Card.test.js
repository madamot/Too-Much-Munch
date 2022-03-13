import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Card from "./Card";

describe('Listing card', () => {
    let expectedProps;

    beforeEach(() => {
        expectedProps = {
            id: 1,
            title: 'Burger',
            image: null,
            course: {
                id: 1,
                uid: 'starter',
                name: 'Starter'
            },
            cuisine: {
                id: 1,
                uid: 'indian',
                name: 'Indian'
            },
            meal: {
                id: 1,
                uid: 'breakfast',
                name: 'Breakfast'
            },
        };
    });

    test('render title of recipe', () => {
        const { getByText } = render(<Card state='recipe' display='card' key={expectedProps.id} id={expectedProps.id} recipe={expectedProps} imagesrc={expectedProps?.image?.url} />);
        const title = getByText(expectedProps.title);

        expect(title).toBeVisible();
    });

    // test('render draft flag', () => {
    //     expectedProps.status = 'draft'

    //     const { getByText } = render(<Listing presentation={expectedProps} />);
    //     const status = getByText('Draft');

    //     expect(status).toBeVisible();
    // });

    // test('render menu actions', () => {
    //     const { getByText } = render(<Listing presentation={expectedProps} />);
    //     const title = getByText('New presentation');
        
    //     fireEvent.click(screen.getByText(expectedProps.title))

    //     const Edit = getByText('Edit');
    //     const Preview = getByText('Preview');
    //     const Download = getByText('Download');
    //     const Delete = getByText('Delete');
        
    //     expect(Edit).toBeVisible();
    //     expect(Preview).toBeVisible();
    //     expect(Download).toBeVisible();
    //     expect(Delete).toBeVisible();
    // });

});