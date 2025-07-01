import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  test('renders button with default props and has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary');
    expect(await axe(container)).toHaveNoViolations();
  });

  test('destructive variant has no accessibility violations', async () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  test('large size has no accessibility violations', async () => {
    const { container } = render(<Button size="lg">Large Button</Button>);
    expect(screen.getByRole('button', { name: /large button/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  test('disabled button has no accessibility violations', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
    expect(await axe(container)).toHaveNoViolations();
  });

  test('asChild link has no accessibility violations', async () => {
    const { container } = render(
      <Button asChild>
        <a href="/">Link Button</a>
      </Button>
    );
    expect(screen.getByRole('link', { name: /link button/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
