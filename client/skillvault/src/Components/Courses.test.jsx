import React from 'react';
import { render, screen } from '@testing-library/react';
import Courses from './Courses';

test('renders Courses component', () => {
    render(<Courses />);
    const linkElement = screen.getByText(/courses/i);
    expect(linkElement).toBeInTheDocument();
});