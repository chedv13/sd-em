import React, { type FC, useCallback, useEffect, useState } from 'react';
import { widget } from '@wix/editor';
import {
  Dropdown,
  FormField,
  Input,
  SectionHelper,
  SidePanel,
  ToggleSwitch,
  WixDesignSystemProvider,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

// Свойства виджета = атрибуты кастомного элемента (см. element.tsx, observedAttributes).
type PropName =
  | 'connection-id'
  | 'drawing-id'
  | 'text'
  | 'custom-text'
  | 'theme'
  | 'size'
  | 'shape'
  | 'align'
  | 'logo'
  | 'full-width'
  | 'guest-mode';

const DEFAULTS: Record<PropName, string> = {
  'connection-id': '',
  'drawing-id': '',
  text: 'enter_draw',
  'custom-text': '',
  theme: 'light',
  size: 'medium',
  shape: 'rectangular',
  align: 'center',
  logo: 'true',
  'full-width': 'false',
  'guest-mode': 'anonymous',
};

const PROP_NAMES = Object.keys(DEFAULTS) as PropName[];

const options = (items: Record<string, string>) =>
  Object.entries(items).map(([id, value]) => ({ id, value }));

const TEXTS = options({
  enter_draw: 'Enter draw',
  join_giveaway: 'Join giveaway',
  participate: 'Participate',
  try_your_luck: 'Try your luck',
  custom: 'Custom text',
});
const THEMES = options({ light: 'Light', dark: 'Dark', auto: "Auto (visitor's system)" });
const SIZES = options({ small: 'Small', medium: 'Medium', large: 'Large' });
const SHAPES = options({ rectangular: 'Rectangular', pill: 'Pill' });
const ALIGNS = options({ left: 'Left', center: 'Center', right: 'Right' });
const GUEST_MODES = options({
  anonymous: 'Can enter with an anonymous ID',
  login: 'Must log in first',
});

const Panel: FC = () => {
  const [props, setProps] = useState<Record<PropName, string>>(DEFAULTS);

  useEffect(() => {
    Promise.all(PROP_NAMES.map((name) => widget.getProp(name).catch(() => undefined))).then(
      (values) => {
        const loaded = { ...DEFAULTS };
        PROP_NAMES.forEach((name, i) => {
          if (values[i]) {
            loaded[name] = values[i] as string;
          }
        });
        setProps(loaded);
      },
    );
  }, []);

  const set = useCallback((name: PropName, value: string) => {
    setProps((prev) => ({ ...prev, [name]: value }));
    widget.setProp(name, value);
  }, []);

  const input = (name: PropName) => (event: React.ChangeEvent<HTMLInputElement>) =>
    set(name, event.target.value.trim());

  const select = (name: PropName, items: { id: string; value: string }[]) => (
    <Dropdown
      options={items}
      selectedId={props[name]}
      onSelect={(option) => set(name, String(option.id))}
    />
  );

  const toggle = (name: PropName) => (
    <ToggleSwitch
      checked={props[name] === 'true'}
      onChange={(event) => set(name, event.target.checked ? 'true' : 'false')}
    />
  );

  return (
    <WixDesignSystemProvider>
      <SidePanel width="300" height="100vh">
        <SidePanel.Content noPadding stretchVertically>
          <SidePanel.Field>
            <FormField label="Connection ID" infoContent="Unique identifier of your shop in ENTD.">
              <Input value={props['connection-id']} onChange={input('connection-id')} />
            </FormField>
          </SidePanel.Field>
          <SidePanel.Field>
            <FormField label="Drawing ID" infoContent="ID of the shop drawing in ENTD.">
              <Input value={props['drawing-id']} onChange={input('drawing-id')} />
            </FormField>
          </SidePanel.Field>
          <SidePanel.Field>
            <FormField label="Visitors who are not logged in">
              {select('guest-mode', GUEST_MODES)}
            </FormField>
          </SidePanel.Field>

          <SidePanel.Field>
            <FormField label="Label">{select('text', TEXTS)}</FormField>
          </SidePanel.Field>
          {props.text === 'custom' && (
            <SidePanel.Field>
              <FormField label="Custom text">
                <Input
                  value={props['custom-text']}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    set('custom-text', event.target.value)
                  }
                />
              </FormField>
            </SidePanel.Field>
          )}
          <SidePanel.Field>
            <FormField label="Theme">{select('theme', THEMES)}</FormField>
          </SidePanel.Field>
          <SidePanel.Field>
            <FormField label="Size">{select('size', SIZES)}</FormField>
          </SidePanel.Field>
          <SidePanel.Field>
            <FormField label="Shape">{select('shape', SHAPES)}</FormField>
          </SidePanel.Field>
          <SidePanel.Field>
            <FormField label="Alignment">{select('align', ALIGNS)}</FormField>
          </SidePanel.Field>
          <SidePanel.Field>
            <FormField label="Show ENTD mark" labelPlacement="left">
              {toggle('logo')}
            </FormField>
          </SidePanel.Field>
          <SidePanel.Field>
            <FormField label="Full width" labelPlacement="left">
              {toggle('full-width')}
            </FormField>
          </SidePanel.Field>
        </SidePanel.Content>
        <SidePanel.Footer noPadding>
          <SectionHelper fullWidth appearance="standard" border="topBottom">
            Get your Connection ID and Drawing ID in the ENTD dashboard.
          </SectionHelper>
        </SidePanel.Footer>
      </SidePanel>
    </WixDesignSystemProvider>
  );
};

export default Panel;
