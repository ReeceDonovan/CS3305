import {
  Header,
  HeaderName,
  HeaderContainer,
  SkipToContent,
  HeaderMenuButton,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavItem,
  SideNavMenuItem,
  SideNavMenu,
} from "carbon-components-react/lib/components/UIShell";
import Notification20 from "@carbon/icons-react/lib/notification/20";
import User20 from "@carbon/icons-react/lib/user/20";

export default function Head() {
  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header
          style={{
            maxWidth: '100vw'
          }}
          aria-label="UCC SRES"
        >
          {/* <SkipToContent /> */}
          <HeaderMenuButton
            isCollapsible
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded}
          />
          <HeaderName href="/" prefix="UCC">
            SREC
          </HeaderName>
          <HeaderGlobalBar>
            <HeaderGlobalAction aria-label="Notifications">
              <Notification20 />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              style={{ marginRight: "1em" }}
              aria-label="Account"
            >
              <User20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
          <SideNav
            aria-label="Side navigation"
            isRail
            expanded={isSideNavExpanded}
            onOverlayClick={onClickSideNavExpand}
          >
            <SideNavItems>
              <SideNavItem>
                <SideNavMenuItem href="/">Home</SideNavMenuItem>
              </SideNavItem>
              <SideNavItem>
                <SideNavMenuItem href="/about">About</SideNavMenuItem>
              </SideNavItem>
            </SideNavItems>
          </SideNav>
        </Header>
      )}
    />
  );
}
