import { MenuItem } from '@mui/material'
import { Services } from '../../../API.js'
import { useAppearance } from '../../Personas/api.js'
import { Appearance } from '@masknet/theme'

import SettingSelect from './SettingSelect.js'
import { useDashboardI18N } from '../../../locales/index.js'

export default function AppearanceSetting() {
    const t = useDashboardI18N()
    const mode = useAppearance()
    const handleChange = (event: any) => {
        Services.Settings.setTheme(event.target.value)
    }

    return (
        <SettingSelect value={mode} onChange={handleChange}>
            <MenuItem value={Appearance.default}>{t.settings_appearance_default()}</MenuItem>
            <MenuItem value={Appearance.light}>{t.settings_appearance_light()}</MenuItem>
            <MenuItem value={Appearance.dark}>{t.settings_appearance_dark()}</MenuItem>
        </SettingSelect>
    )
}
