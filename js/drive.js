const CLIENT_ID = '839564767921-e3gq6v42a3660o7kr6r4fsgjdouverbe.apps.googleusercontent.com';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    gapi.client.init({
      clientId: CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  function handleSignInClick() {
    gapi.auth2.getAuthInstance().signIn();
  }

  function handleSignOutClick() {
    gapi.auth2.getAuthInstance().signOut();
  }

  function getTargetFolderId() {
    // Replace 'YOUR_FOLDER_ID' with the folder ID where you want to upload the file.
    return 'IniIse';
  }

  function uploadFile() {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const metadata = {
      name: file.name,
      mimeType: file.type,
    parents: [getTargetFolderId()]
    };

    const reader = new FileReader();
    reader.onload = function () {
      const base64Data = btoa(reader.result);
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelimiter = "\r\n--" + boundary + "--";

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + file.type + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        closeDelimiter;

      const request = gapi.client.request({
        'path': 'https://www.googleapis.com/upload/drive/v3/files',
        'method': 'POST',
        'params': { 'uploadType': 'multipart' },
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
      });

      request.execute(function (file) {
        console.log('File ID:', file.id);
        // Handle the successful upload here.
      });
    };
    reader.readAsBinaryString(file);
  }

  handleClientLoad();