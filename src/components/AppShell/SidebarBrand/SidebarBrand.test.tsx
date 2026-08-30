import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Sidebar, SidebarProvider } from '@snc-software/snc-ui';
import { SidebarBrand } from './SidebarBrand';

describe('SidebarBrand', () => {
  it('renders the brand mark and name', () => {
    const { getByText } = render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarBrand />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(getByText('S')).toBeInTheDocument();
    expect(getByText('SNC')).toBeInTheDocument();
  });

  it('fades the brand name out when the sidebar is collapsed to icons', () => {
    const { getByText } = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarBrand />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(getByText('SNC').className).toContain('opacity-0');
  });
});
