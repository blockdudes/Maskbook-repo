import { story } from '@masknet/storybook-shared'
import { action } from '@storybook/addon-actions'
import { ReceiveDialogUI as C } from '../../../src/pages/Wallets/components/ReceiveDialog/index.js'

const { meta, of } = story(C)

export default meta({ title: 'Components/Wallet/Receive Dialog' })

export const ReceiveDialog = of({
    args: {
        open: true,
        onClose: action('onClose'),
        address: '0xFD7A5D91AF554ACD8ED07c7911E8556a7D20D88a',
    },
})
