import {
  mdiArrowLeft,
  mdiArrowRight,
  mdiReload,
  mdiInformationOutline,
  mdiDotsHorizontal,
  mdiBookmarkPlusOutline,
  mdiBookmarkOutline,
  mdiPuzzleOutline,
} from '@mdi/js';
import { Icon } from '../Icon';
import { WindowControls } from '../WindowControls';
import classes from './index.module.scss';

export const AddressBar = () => {
  return (
    <div class={classes.addressBar}>
      <button class={classes.addressBarButton} aria-label="backwards in history">
        <Icon path={mdiArrowLeft} />
      </button>
      <button class={classes.addressBarButton} aria-label="forwards in hsitory">
        <Icon path={mdiArrowRight} />
      </button>
      <button class={classes.addressBarButton} aria-label="reload page">
        <Icon path={mdiReload} />
      </button>
      <form class={classes.urlBar} action="">
        <button
          type="button"
          class={`${classes.urlBarButton} ${classes.urlBarButtonInfo}`}
          aria-label="page info"
        >
          <Icon path={mdiInformationOutline} />
        </button>
        <input
          type="url"
          class={classes.urlBarInput}
          placeholder="Search with DuckDuckGo or enter address"
        />
        <button
          type="button"
          class={`${classes.urlBarButton} ${classes.urlBarButtonBookmark}`}
          aria-label="add to bookmarks"
        >
          <Icon path={mdiBookmarkPlusOutline} />
        </button>
      </form>
      <button class={classes.addressBarButton} aria-label="extensions">
        <Icon path={mdiPuzzleOutline} />
      </button>
      <button class={classes.addressBarButton} aria-label="bookmarks">
        <Icon path={mdiBookmarkOutline} />
      </button>
      <button class={classes.addressBarButton} aria-label="menu">
        <Icon path={mdiDotsHorizontal} />
      </button>
      <WindowControls />
    </div>
  );
};
