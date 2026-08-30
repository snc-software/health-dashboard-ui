import { useSidebar } from '@snc-software/snc-ui';
import { cn } from '@/utils';
import { classes } from './SidebarBrand.styles';

export function SidebarBrand() {
  const { state, collapsible, isMobile } = useSidebar();
  const isCollapsedToIcon = !isMobile && collapsible === 'icon' && state === 'collapsed';

  return (
    <div className={cn(classes.row, isCollapsedToIcon && classes.rowCollapsed)}>
      <div className={classes.mark}>S</div>
      <div className={cn(classes.name, isCollapsedToIcon && classes.nameCollapsed)}>SNC</div>
    </div>
  );
}
