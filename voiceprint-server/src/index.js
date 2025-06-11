const express = require('express');
const multer = require('multer');
const { PythonShell } = require('python-shell');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });
//const scriptPath = path.resolve(__dirname, './compare_voiceprints.py');
const scriptPath = path.resolve(__dirname, './compare_voiceprints.py');

app.post('/compare', upload.fields([{ name: 'file1' }, { name: 'file2' }]), async (req, res) => {
  try {
    const file1 = path.resolve(req.files['file1'][0].path);
    const file2 = path.resolve(req.files['file2'][0].path);

    // Verify files exist
    // if (!fs.existsSync(file1) throw new Error(`${file1} does not exist`);
    //if (!fs.existsSync(file2)) throw new Error(`${file2} does not exist`);

    const options = {
      mode: 'text',
      pythonPath: '/usr/bin/python3', // ABSOLUTE PATH TO VENV PYTHON
      pythonOptions: ['-u'],
      args: [file1, file2]
    };

    //options.stderr = true;


    // Debug logging
    // console.log('Executing Python with options:');
    // console.log('- Python Path:', options.pythonPath);
    // console.log('- Script Path:', scriptPath);
    // console.log('- File 1:', file1);
    // console.log('- File 2:', file2);

    let result = await PythonShell.run(scriptPath, options);
    result = JSON.parse(result)
    return res.status(200).send(result);


  } catch (setupError) {
    console.error('Setup Error:', setupError);
    return res.status(500).send(setupError);

  }

});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(res);
});

app.listen(3002, () => console.log('Server running on http://localhost:3002'));