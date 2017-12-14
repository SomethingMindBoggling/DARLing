import { Card, CardActions, CardHeader, CardMedia, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default props => (
  <Card>
    <CardHeader
      title={'Author name'}
      subtitle="Author researcher title"
      avatar="https://api.adorable.io/avatars/60/abott@adorable.io.png" />
    <CardMedia>
      <img src="https://i.ytimg.com/vi/yZ0G9jljCto/maxresdefault.jpg" alt="Dataset Network" />
    </CardMedia>
    <CardTitle title="Dataset title" subtitle="Dataset subtitle" />
    <CardActions>
      <FlatButton label="View" />
    </CardActions>
  </Card>
);
