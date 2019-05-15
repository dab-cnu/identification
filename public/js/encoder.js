function encodeHumanInfo(_publicKey, _data) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(_publicKey);

    return encrypt.encrypt(_data);
}

function makeSign(_privateKey) {
    var sign = new JSEncrypt();
    sign.setPrivateKey(_privateKey);

    return sign.sign('ok', sha256, "sha256");
}