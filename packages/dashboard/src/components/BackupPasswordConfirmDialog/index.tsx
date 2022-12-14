import { memo, useContext, useMemo, useState } from 'react'
import { Button, DialogActions, DialogContent, Typography } from '@mui/material'
import { ConfirmPasswordOption, UserContext } from '../../pages/Settings/hooks/UserContext.js'
import { MaskDialog } from '@masknet/theme'
import { useDashboardI18N } from '../../locales/index.js'
import { useNavigate } from 'react-router-dom'
import { DashboardRoutes } from '@masknet/shared-base'
import PasswordField from '../PasswordField/index.js'

interface DialogProps {
    open: boolean
    option?: ConfirmPasswordOption
    onClose(): void
    onConfirmed(): void
}

export const BackupPasswordConfirmDialog = memo<DialogProps>(({ onConfirmed, onClose, open, option }) => {
    const t = useDashboardI18N()
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const onSubmitPassword = () => {
        if (user.backupPassword === password) {
            onConfirmed()
        } else {
            setError(t.settings_dialogs_incorrect_password())
        }
    }

    const title = useMemo(() => {
        return (user.backupPassword ? option?.confirmTitle : option?.tipTitle) ?? t.confirm_password()
    }, [option?.tipTitle, option?.confirmTitle])

    return (
        <MaskDialog open={open} title={title} onClose={onClose} maxWidth="xs">
            {!user.backupPassword && (
                <>
                    <DialogContent sx={{ py: 0, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" fontSize={13}>
                            {option?.tipContent}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={onClose}>
                            {t.personas_cancel()}
                        </Button>
                        <Button onClick={() => navigate(DashboardRoutes.Settings, { state: { open: 'password' } })}>
                            {t.settings()}
                        </Button>
                    </DialogActions>
                </>
            )}
            {user.backupPassword && (
                <>
                    <DialogContent sx={{ py: 0, display: 'flex', alignItems: 'center' }}>
                        <PasswordField
                            sx={{ flex: 1 }}
                            onChange={(e) => {
                                setPassword(e.currentTarget.value)
                                setError('')
                            }}
                            placeholder={t.settings_label_backup_password()}
                            error={!!error}
                            helperText={error}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={onClose}>
                            {t.personas_cancel()}
                        </Button>
                        <Button disabled={!!error} onClick={onSubmitPassword}>
                            {t.personas_confirm()}
                        </Button>
                    </DialogActions>
                </>
            )}
        </MaskDialog>
    )
})
