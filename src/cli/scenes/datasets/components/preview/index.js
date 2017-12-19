import { Card, CardActions, CardHeader, CardMedia, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Link} from "react-router-dom";

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
      <Link to="/dataset/1234">
        <FlatButton label="View" />
      </Link>
    </CardActions>
  </Card>
);
