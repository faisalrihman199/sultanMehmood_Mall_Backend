const { v4: uuidv4 } = require('uuid');

class BarcodeService {
  async generateBarcode() {
    const prefix = 'SMM';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  }

  async generateBarcodeImage(barcodeText) {
    try {
      const bwipjs = require('bwip-js');
      const png = await bwipjs.toBuffer({
        bcid: 'code128',
        text: barcodeText,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
      return png;
    } catch (error) {
      console.error('Barcode generation failed:', error);
      return null;
    }
  }
}

module.exports = new BarcodeService();
