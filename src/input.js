const spawn = require('child_process').spawn;
const os = require('os');
const tempfile = require('tempfile');
const fs = require('fs-extra');
const save = require('./save/save');
const create = require('./create/create-item');
const detect = require("jschardet").detect;
const iconv = require('iconv-lite');

// const command = "notepad";
const command = "c:\\Program Files\\Notepad++\\notepad++.exe";
// const command = "c:\\Program Files\\Sublime Text 3\\sublime_text.exe";
const filename = tempfile('.md');

fs.writeFileSync(filename, '', 'utf8');
console.log('write success');

spawn(command, [filename], { stdio: 'inherit' }).on('close', (err, data) => {
  console.log(err, data);

  fs.readFile(filename, (error, data) => {
    if (!error) {
      var encs = {
        'ascii': 'cp866',
        'UTF-8': 'utf8',
        'windows-1251': 'win1251'
      };
      console.log(detect(data).encoding, encs[detect(data).encoding]);
      console.log('success', iconv.decode(data, encs[detect(data).encoding]));
    }
    else console.log(error);
  });
});



// process.stdout.on("data")

// function edit(file) {
//   return new Promise((resolve, reject) => {
//     var subl = "c:\\Program Files\\Sublime Text 3\\sublime_text.exe";
//     const editorCommand = os.platform().match(/win/g) ? subl : 'nano';
//     console.log(file);

//     fs.writeFile(file, '', () => {
//       console.log("zu")
//       const editor = spawn(editorCommand, ['--new-window', file], { stdio: 'inherit' });

//       editor.on('exit', () => {
//         fs.readFile(file, 'utf8', (error, content) => {
//           if (!error) {
//             resolve(content);
//           } else {
//             reject(error);
//           }
//         });
//       });
//     });
//     // fs.outputFile(file, '', () => {
//     // });
//   });
// }

// edit(tempfile('.md'))
//   .then((content) => {
//     save(create(content.toString()), (error) => {
//       console.log(content, error);
//     });
//     // console.log(content.toString());
//   });



/*


const fs = require('fs')
const getStdin = require('get-stdin')
const spawn = require('child_process').spawn
const tempfile = require('tempfile')
const prompt = require('prompt-promise')
const resolvePath = require('path').resolve

function getFileContents (file) {
  return new Promise((resolve, reject) => {
    fs.exists(file, (exists) => {
      if (exists) {
        fs.readFile(file, 'utf8', (err, contents) => {
          if (err) {
            reject(err)
          } else {
            resolve(contents)
          }
        })
      } else {
        reject('File does not exist: ' + resolvePath(file))
      }
    })
  })
}

function trimNewLine (str) {
  if (str[str.length -1] === '\n') {
    return str.slice(0, -1)
  }
  return str
}

const edit = (file) => {
  return new Promise((resolve, reject) => {
    var editorCmd = process.env.EDITOR || 'nano'
    var editor = spawn(editorCmd, [file], {stdio: 'inherit'})
    editor.on('exit', () => {
      fs.readFile(file, 'utf8', (err, contents) => {
        if (err) {
          reject(err)
        } else {
          resolve(contents)
        }
      })
    })
  }).then(trimNewLine)
}

const editContent = (initialContent, fileType, verify) => {
  var tmpFile = tempfile(fileType)
  fs.writeFileSync(tmpFile, initialContent, 'utf8')
  return edit(tmpFile)
  .then((content) => {
    var verifyPromise = Promise.resolve(true)
    if (verify) {
      verifyPromise = Promise.resolve(verify(content))
    }
    return verifyPromise
    .then((isOk) => {
      if (isOk) {
        fs.unlinkSync(tmpFile)
        return content
      } else {
        return prompt('You entered a not valid document. Do you want to continue (c), reset (r) or abort (a): ')
        .then((res) => {
          process.stdin.pause()
          if (res === 'c') {
            return editContent(content, fileType, verify)
          } else if (res === 'r') {
            return editContent(initialContent, fileType, verify)
          } else {
            throw new Error('User aborted editing.')
          }
        })
      }
    })
  })
}

function fileStdinOrEdit (file, {inStream = process.stdin, fileType = '.json', defaultContent = '', verify = null}) {
  if (file && file.length > 0) {
    return getFileContents(file)
    .then((content) => {
      var verifyPromise = Promise.resolve(true)
      if (verify) {
        verifyPromise = Promise.resolve(verify(content))
      }
      return verifyPromise
      .then((valid) => (valid) ? content : Promise.reject('Contents do not satisfy constraints.'))
    })
  } else if (!process.stdin.isTTY) {
    return getStdin().then(trimNewLine)
    .then((content) => {
      var verifyPromise = Promise.resolve(true)
      if (verify) {
        verifyPromise = Promise.resolve(verify(content))
      }
      return verifyPromise
      .then((valid) => (valid) ? content : Promise.reject('Contents do not satisfy constraints.'))
    })
  } else {
    return editContent(defaultContent, fileType, verify)
  }
}


function input (file, conf) {
  conf = conf || {}
  return fileStdinOrEdit(file, conf)
}

module.exports = {
  input,
  edit,
  editContent
}

*/
