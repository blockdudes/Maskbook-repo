import { makeStyles } from '@masknet/theme'
import { Box, Skeleton } from '@mui/material'
import { range } from 'lodash-unified'

const useStyles = makeStyles()((theme) => ({
    root: {
        display: 'grid',
        flexWrap: 'wrap',
        gridTemplateColumns: 'repeat(auto-fill, minmax(172px, 1fr))',
        gridGap: theme.spacing(1),
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        padding: theme.spacing(1),
    },
}))

export const LoadingCollectible = () => {
    const { classes } = useStyles()
    return (
        <Box className={classes.root}>
            {range(3).map((i) => (
                <Box className={classes.card} display="flex" flexDirection="column" key={i}>
                    <Skeleton animation="wave" variant="rectangular" width={172} height={172} />
                    <Skeleton animation="wave" variant="text" width={172} height={20} style={{ marginTop: 4 }} />
                </Box>
            ))}
        </Box>
    )
}
