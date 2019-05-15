function decodeHumanInfo(_privateKey, _encodedData) {
    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(_privateKey);

    return decrypt.decrypt(_encodedData);
}

function verifySign(_publicKey, signature) {
    var verify = new JSEncrypt();
    verify.setPublicKey(_publicKey);
    
    return verify.verify('ok', signature, sha256);
}