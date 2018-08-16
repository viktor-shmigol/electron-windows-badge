const { nativeImage, ipcMain } = require('electron');
const BadgeGenerator = require('./badge_generator.js');
const badgeDescription = 'New notification';
const UPDATE_BADGE_EVENT = 'update-badge';

module.exports = class Badge {
  constructor(win, opts = {}) {
    this.win = win;
    this.opts = opts;
    this.generator = new BadgeGenerator(win, opts);
    this.initListeners();
  }

  update(badgeNumber) {
    if (badgeNumber) {
      this.generator.generate(badgeNumber).then((base64) => {
        const image =  nativeImage.createFromDataURL(base64);
        this.win.setOverlayIcon(image, badgeDescription);
      });
    } else {
      this.win.setOverlayIcon(null, badgeDescription);
    }
  }

  initListeners() {
    ipcMain.on(UPDATE_BADGE_EVENT, (event, badgeNumber) => {
      this.update(badgeNumber);
      event.returnValue = 'success';
    });
  }
}
