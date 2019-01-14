const fs = require('fs');
const faker = require('faker');

let NUM_PRODUCTS = 100;
let NUM_AUTHORS = 100;
let NUM_REVIEWS = 200;
let NUM_FEATURES = 10;
let NUM_MEDIA = 50;

let getRandomInt = function(start, stop) {
  return Math.floor((Math.random() * (stop - start)) + start);
};

let getRandomDouble = function(start = 0, stop = 5) {
  return ((Math.random() * (stop - start)) + start).toFixed(1);
};

const dest1 = fs.createWriteStream('tab1-products.tsv', {flags: 'a'});
const dest2 = fs.createWriteStream('tab2-authors.tsv', {flags: 'a'});
const dest3 = fs.createWriteStream('tab3-reviews.tsv', {flags: 'a'});
const dest4 = fs.createWriteStream('tab4-features.tsv', {flags: 'a'});
const dest5 = fs.createWriteStream('tab5-media.tsv', {flags: 'a'});

/*
  1) run file with headers1-5 uncommented, and appendCSVs commented
  2) comment out headers, uncomment appendCSV invoktions, rerun file
*/

// header1 = fs.writeFileSync('tab1-products.tsv', `id\tname\n`);
// header2 = fs.writeFileSync('tab2-authors.tsv', `id\tusername\tavatar\n`);
// header3 = fs.writeFileSync('tab3-reviews.tsv', `id\theadline\tbody\tstars\tposted\thelpful\tverified\tauthor_id\tproduct_id\tFOREIGN KEY (author_id) REFERENCES authors(id)\tFOREIGN KEY (product_id) REFERENCES products(id)\n`);
// header4 = fs.writeFileSync('tab4-features.tsv', `id\tfeature\trating\tcount\tproduct_id\tFOREIGN KEY (product_id) REFERENCES products(id)\n`);
// header5 = fs.writeFileSync('tab5-media.tsv', `id\ttype\tfile\treview_id\tFOREIGN KEY (review) REFERENCES reviews(id)\n`);

function appendCSV(writer) {
  let startTime = Date.now();
  let i = 10000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // last time!
        writer.write(`${i}\t${faker.name.firstName()}\n`);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(`${i}\t${faker.name.firstName()}\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
    let endTime = Date.now();
    console.log(`Time to complete: ${endTime - startTime}`);
  }
}
  
  function appendCSV2(writer) {
    let startTime = Date.now();
    let i = 10000000;
    write();
    function write() {
      let ok = true;
      do {
        i--;
        if (i === 0) {
          // last time!
          writer.write(`${i}\t${faker.internet.userName()}\t${faker.image.avatar()}\n`);
        } else {
          // see if we should continue, or wait
          // don't pass the callback, because we're not done yet.
          ok = writer.write(`${i}\t${faker.internet.userName()}\t${faker.image.avatar()}\n`);
        }
      } while (i > 0 && ok);
      if (i > 0) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
      let endTime = Date.now();
      console.log(`Time to complete: ${endTime - startTime}`);
  }
}

function appendCSV3(writer) {
  let startTime = Date.now();
  let i = 10000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // last time!
        writer.write(`${i}\t${faker.company.catchPhrase()}\t${faker.lorem.paragraph()}\t${getRandomInt(1,6)}\t${faker.date.past().toISOString().split('T')[0]}\t${getRandomInt(0,1500)}\t${faker.random.boolean()}\t${getRandomInt(1,NUM_AUTHORS+1)}\t${getRandomInt(1,NUM_PRODUCTS+1)}\tnull\tnull\n`);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(`${i}\t${faker.company.catchPhrase()}\t${faker.lorem.paragraph()}\t${getRandomInt(1,6)}\t${faker.date.past().toISOString().split('T')[0]}\t${getRandomInt(0,1500)}\t${faker.random.boolean()}\t${getRandomInt(1,NUM_AUTHORS+1)}\t${getRandomInt(1,NUM_PRODUCTS+1)}\tnull\tnull\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
    let endTime = Date.now();
    console.log(`Time to complete: ${endTime - startTime}`);
  }
}

function appendCSV4(writer) {
  let startTime = Date.now();
  let i = 10000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // last time!
        writer.write(`${i}\t${faker.commerce.productAdjective()}\t${getRandomDouble()}\t${getRandomInt(0, 1000)}\t${getRandomInt(1, NUM_PRODUCTS)}\tnull\n`);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(`${i}\t${faker.commerce.productAdjective()}\t${getRandomDouble()}\t${getRandomInt(0, 1000)}\t${getRandomInt(1, NUM_PRODUCTS)}\tnull\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
    let endTime = Date.now();
    console.log(`Time to complete: ${endTime - startTime}`);
  }
}

function appendCSV5(writer) {
  let startTime = Date.now();
  let i = 10000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // last time!
        console.log('here')
        writer.write(`${i}\t'photo'\t${faker.image.image()}\t${getRandomInt(1, 100)}\tnull\n`);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(`${i}\t'photo'\t${faker.image.image()}\t${getRandomInt(1, 100)}\tnull\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
    let endTime = Date.now();
    console.log(`Time to complete: ${endTime - startTime}`);
  }
}

appendCSV(dest1);
appendCSV2(dest2);
appendCSV3(dest3);
appendCSV4(dest4);
appendCSV5(dest5);

// ================================

// const append = async (num) => {
//   let startTime = Date.now();
//     try {
//       for (let i = 0; i <= num; i++) {
//         const dest1 = fs.createWriteStream('tab1-products.tsv', {flags: 'a'});
//         const dest2 = fs.createWriteStream('tab2-authors.tsv', {flags: 'a'});
//         const dest3 = fs.createWriteStream('tab3-reviews.tsv', {flags: 'a'});
//         const dest4 = fs.createWriteStream('tab4-features.tsv', {flags: 'a'});
//         const dest5 = fs.createWriteStream('tab5-media.tsv', {flags: 'a'});

//         await dest1.write(dest1, `${i}\t${faker.name.firstName()}\n`)
//         console.log('tab-1 done')
//         // await dest2.write(dest2, `${i}\t${faker.internet.userName()}\t${faker.image.avatar()}\n`)
//         // console.log('tab-2 done')
//         // await dest3.write(dest3, `${i}\t${faker.company.catchPhrase()}\t${faker.lorem.paragraph()}\t${getRandomInt(1,6)}\t${faker.date.past().toISOString().split('T')[0]}\t${getRandomInt(0,1500)}\t${faker.random.boolean()}\t${getRandomInt(1,NUM_AUTHORS+1)}\t${getRandomInt(1,NUM_PRODUCTS+1)}\n`)
//         // console.log('tab-3 done')
//         // await dest4.write(dest4, `${i}\t${faker.commerce.productAdjective()}\t${getRandomDouble()}\t${getRandomInt(0, 1000)}\t${getRandomInt(1, NUM_PRODUCTS)}\n`)
//         // console.log('tab-4 done')
//         // await dest5.write(dest5, `${i}\t'photo'\t${faker.image.image()}\t${getRandomInt(1, 100)}\n`)
//         // console.log('tab-5 done')
//       }
//     } catch (err) {
//       console.log('error', err)
//   } finally {
//     let endTime = Date.now();
//     console.log(`Time to complete: ${endTime - startTime}`);
//     process.exit()
//   }
// }
// append(100)
