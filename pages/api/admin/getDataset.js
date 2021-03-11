import { database } from "../../../firebase/firebase"

// return all the dataset data
export default async function loadAllDataset(req, res) {
    let query = database.collection('datasets');
    let response = [];
    await query.get().then(querySnapshot => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
            const selectedItem = {
                id: doc.id,

                filename: doc.data().filename,
                size: doc.data().size,
                uploadTime: doc.data().uploadTime.substring(0, 16).replace("T", " "),
                uploader: doc.data().uploader

            };
            response.push(selectedItem);
        }
    });


    res.status(200).send(response)

}
