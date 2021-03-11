import React from 'react'
import { getDecryptedSecret } from '../utils/encryption/decryptit'
import { encCOOKIE_SECRET, enc_Client_ID, enc_CLIENT_SECRET, enc_DOMAIN } from '../utils/encryption/service-account.enc'

console.log(getDecryptedSecret(enc_DOMAIN))
console.log(getDecryptedSecret(enc_Client_ID))
console.log(getDecryptedSecret(enc_CLIENT_SECRET))
console.log(getDecryptedSecret(encCOOKIE_SECRET))

const test = () => {
    return (
        <div>

        </div>
    )
}

export default test
