import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  OrganizerAppShell,
  type OrganizerAppShellLayout,
  type OrganizerAppShellNavigation
} from "./organizer-app-shell";

const meta = {
  title: "Patterns/OrganizerAppShell",
  component: OrganizerAppShell,
  parameters: {
    layout: "fullscreen"
  },
  args: {
    layout: "responsive",
    navigation: "expanded"
  },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["responsive", "desktop", "mobile"]
    },
    navigation: {
      control: "inline-radio",
      options: ["expanded", "collapsed"]
    }
  }
} satisfies Meta<typeof OrganizerAppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {};

export const DesktopExpanded: Story = {
  args: {
    layout: "desktop",
    navigation: "expanded"
  }
};

export const DesktopCollapsed: Story = {
  args: {
    layout: "desktop",
    navigation: "collapsed"
  }
};

export const MobileExpanded: Story = {
  args: {
    layout: "mobile",
    navigation: "expanded"
  }
};

export const MobileCollapsed: Story = {
  args: {
    layout: "mobile",
    navigation: "collapsed"
  }
};

const variants: Array<{
  layout: Exclude<OrganizerAppShellLayout, "responsive">;
  navigation: OrganizerAppShellNavigation;
}> = [
  { layout: "desktop", navigation: "expanded" },
  { layout: "desktop", navigation: "collapsed" },
  { layout: "mobile", navigation: "expanded" },
  { layout: "mobile", navigation: "collapsed" }
];

export const VariantMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 32,
        justifyItems: "start",
        padding: 32
      }}
    >
      {variants.map(({ layout, navigation }) => (
        <OrganizerAppShell
          key={`${layout}-${navigation}`}
          layout={layout}
          navigation={navigation}
        />
      ))}
    </div>
  )
};

export const WithProductContent: Story = {
  args: {
    children: (
      <div style={{ maxWidth: 520, padding: 24 }}>
        Conteúdo da página do organizador
      </div>
    )
  }
};

export const PersistentNavigation: Story = {
  args: {
    children: (
      <div
        style={{
          display: "grid",
          gap: 16,
          padding: 24
        }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <article
            key={index}
            style={{
              minHeight: 120,
              padding: 24,
              border: "1px solid var(--color-border-default)",
              borderRadius: "var(--radius-12)",
              background: "var(--color-background-surface-default)"
            }}
          >
            Bloco de conteúdo {index + 1}
          </article>
        ))}
      </div>
    ),
    pageHeaderProps: {
      subtitle:
        "Role a página para validar o header e a navegação lateral persistentes.",
      title: "Navegação persistente"
    }
  }
};
