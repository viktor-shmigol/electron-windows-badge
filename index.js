const { nativeImage, ipcMain } = require('electron');
const BadgeGenerator = require('./badge_generator.js');
const badgeDescription = 'New notification';
const UPDATE_BADGE_EVENT = 'update-badge';
let currentOverlayIcon = { image: null, badgeDescription };

module.exports = class Badge {
  constructor(win, opts = {}) {
    this.win = win;
    this.opts = opts;
    this.generator = new BadgeGenerator(win, opts);
    this.initListeners();
    this.win.on('closed', () => { this.win = null; });
    this.win.on('show', () => { this.win.setOverlayIcon(currentOverlayIcon.image, currentOverlayIcon.badgeDescription); });
  }

  update(badgeNumber) {
    if (badgeNumber) {
      this.generator.generate(badgeNumber).then((base64) => {
        const image = nativeImage.createFromDataURL(base64);
        currentOverlayIcon = {
          image,
          badgeDescription
        }
        this.win.setOverlayIcon(currentOverlayIcon.image, currentOverlayIcon.badgeDescription);
      });
    } else {
      currentOverlayIcon = {
        image: null,
        badgeDescription
      }
      this.win.setOverlayIcon(currentOverlayIcon.image, currentOverlayIcon.badgeDescription);
    }
  }

  initListeners() {
    ipcMain.on(UPDATE_BADGE_EVENT, (event, badgeNumber) => {
      if (this.win) {
        this.update(badgeNumber);
      }
      event.returnValue = 'success';
    });
  }
}
