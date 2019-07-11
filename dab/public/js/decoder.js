function decodeHumanInfo(_privateKey, _encodedData) {
    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(_privateKey);
    console.log(_encodedData);
    console.log(decrypt.decrypt(_encodedData));
    return decrypt.decrypt(_encodedData);
}

function verifySign(_publicKey, signature) {
    var verify = new JSEncrypt();
    verify.setPublicKey(_publicKey);
    return verify.verify('ok', signature, calcMD5);
}