import type { FC } from 'react';
import {
  Box,
  Card,
  Page,
  SectionHelper,
  Text,
  TextButton,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

// Онбординг-страница: App Market требует понятную настройку после установки,
// а кнопка «Manage» у виджета ведёт сюда (behaviors.dashboard в extension.ts).
const STEPS = [
  {
    title: 'Get your IDs in ENTD',
    text: 'In your ENTD shop dashboard, copy the Connection ID of this site and the Drawing ID of the draw you want to run.',
  },
  {
    title: 'Add the widget',
    text: 'Open the Editor → Add Elements → App Widgets → ENTD Draw Button, and place it on the page with your product or draw.',
  },
  {
    title: 'Configure it',
    text: 'Select the widget → Settings. Paste the Connection ID and Drawing ID, pick the label, theme, size and whether guests must log in.',
  },
  {
    title: 'Publish',
    text: 'Publish the site. Visitors click the button and enter the draw in the ENTD window without leaving your site.',
  },
];

const EntdDashboardPage: FC = () => {
  return (
    <WixDesignSystemProvider>
      <Page>
        <Page.Header
          title="ENTD Draws"
          subtitle="Run limited releases and giveaways with a draw button on your site."
        />
        <Page.Content>
          <Box direction="vertical" gap="SP4">
            <Card>
              <Card.Header title="Set up in 4 steps" />
              <Card.Divider />
              <Card.Content>
                <Box direction="vertical" gap="SP4">
                  {STEPS.map((step, index) => (
                    <Box key={step.title} direction="vertical" gap="SP1">
                      <Text weight="bold">{`${index + 1}. ${step.title}`}</Text>
                      <Text secondary>{step.text}</Text>
                    </Box>
                  ))}
                </Box>
              </Card.Content>
            </Card>
            <SectionHelper appearance="standard">
              Logged-in site members enter with their Wix member account. Guests either enter with an
              anonymous ID stored in their browser or are asked to log in — you choose in the widget
              settings.
            </SectionHelper>
            <Box gap="SP4">
              <TextButton as="a" href="https://entd.tech" target="_blank" rel="noopener noreferrer">
                Open ENTD
              </TextButton>
              <TextButton as="a" href="mailto:support@entd.tech">
                Contact support
              </TextButton>
            </Box>
          </Box>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default EntdDashboardPage;
