import { useEffect, useRef, useState } from 'react';
import { Search, ViewGrid } from 'iconoir-react';
import {
  CmdK,
  IconButton,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  ThemeToggle,
  Tooltip,
} from '@snc-software/snc-ui';
import type { OptionItem, Theme } from '@snc-software/snc-ui';
import { SidebarBrand } from './SidebarBrand';
import { SEARCHABLE_ROUTES, SEARCH_DEBOUNCE_MS } from './AppShell.constants';
import { classes } from './AppShell.styles';
import type { AppShellProps } from './AppShell.types';

export function AppShell({ children }: AppShellProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [results, setResults] = useState<OptionItem[]>(SEARCHABLE_ROUTES);
  const [searching, setSearching] = useState(false);
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    return () => document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCmdkOpen((open) => !open);
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function closeCmdk() {
    setIsCmdkOpen(false);
    setResults(SEARCHABLE_ROUTES);
    setSearching(false);
  }

  function handleSearch(query: string) {
    const term = query.trim().toLowerCase();
    clearTimeout(searchTimeout.current);

    if (!term) {
      setResults(SEARCHABLE_ROUTES);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeout.current = setTimeout(() => {
      setResults(SEARCHABLE_ROUTES.filter((route) => route.title.toLowerCase().includes(term)));
      setSearching(false);
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <div className={classes.page}>
      <SidebarProvider defaultOpen className={classes.provider}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarBrand />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Overview">
                      <ViewGrid width={16} height={16} strokeWidth={1.6} />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className={classes.header}>
            <div className={classes.headerStart}>
              <Tooltip content="Toggle sidebar" placement="bottom">
                <SidebarTrigger title={undefined} />
              </Tooltip>
            </div>

            <div className={classes.headerActions}>
              <Tooltip content="⌘K" placement="bottom">
                <IconButton label="Search" title={undefined} onClick={() => setIsCmdkOpen(true)}>
                  <Search width={16} height={16} strokeWidth={1.8} />
                </IconButton>
              </Tooltip>

              <Tooltip content="Toggle theme" placement="bottom">
                <ThemeToggle
                  theme={theme}
                  label="Toggle theme"
                  title={undefined}
                  onToggle={toggleTheme}
                />
              </Tooltip>
            </div>
          </header>

          <CmdK
            isOpen={isCmdkOpen}
            onClose={closeCmdk}
            options={results}
            isLoading={searching}
            placeholder="Search"
            debounceMs={200}
            emptyText="No matches"
            closeLabel="Close search"
            onSearch={handleSearch}
          />

          <main className={classes.main}>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
