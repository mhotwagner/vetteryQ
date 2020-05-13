import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import PublishIcon from '@material-ui/icons/Publish';
import StorageIcon from '@material-ui/icons/Storage';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        marginBottom: '1em',
    },
    media: {w
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function RecipeReviewCard(props) {
    const classes = useStyles();

    const title = ( props.user.fullstack ? 'Fullstack' : props.user.backend ? 'Backend' : 'Frontend') + ' Developer';

    const userIcon = ( props.user.fullstack ? <PublishIcon /> : props.user.backend ? <StorageIcon /> : <ViewQuiltIcon />);

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        { userIcon }
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={props.user.email}
                subheader={title}
            />
            <CardContent>
                <Typography className={classes.pos} color="textSecondary">
                    { props.user.languages.map((l) => { return l.name }).join(', ') }
                </Typography>
            </CardContent>
        </Card>
    );
}
