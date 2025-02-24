/* eslint-disable @typescript-eslint/no-explicit-any */

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 450, height: 700 });

// const backend_url = "http://localhost:3030/api/v1"
// figd_sqfzqnubhXhM535K_XSg_nx2QaEFY70SfpKep7ye
// figd_i0CS13S7YJuj_xfJHS5lwLygpE3Sy98bJs_SZ_L0
// eNDMTZhqPS1wYSkLMSaovC
let access_token: string

const getComments = async (fileId: string) => {
  const res = await fetch(`https://api.figma.com/v1/files/${fileId}/comments`, {
    headers: {
      "Content-Type": "application/json",
      'X-FIGMA-TOKEN': access_token
    },
  })

  // console.log(await res.json())
  figma.ui.postMessage({ type: 'get-comment', data: await res.json() })

  return await res.json()
}

const getUser = async () => {
  const res = await fetch(`https://api.figma.com/v1/me`, {
    headers: {
      "Content-Type": "application/json",
      'X-FIGMA-TOKEN': access_token
    },
  })

  console.log('here', await res.json())
  figma.ui.postMessage({ type: 'get-user', data: await res.json() })

  return await res.json()
}

const getFiles = async (fileId: string) => {
  const res = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
    headers: {
      "Content-Type": "application/json",
      'X-FIGMA-TOKEN': access_token
    },
  })

  // console.log(await res.json())
  figma.ui.postMessage({ type: 'get-files', data: { data: await res.json(), fileId: fileId } })

  return await res.json()
}


async function addComment(comment: string, comms: string, fileId: string) {
  const res = await fetch(`https://api.figma.com/v1/files/${fileId}/comments`, {
    headers: {
      "Content-Type": "application/json",
      'X-FIGMA-TOKEN': access_token
    },
    method: "POST",
    body: JSON.stringify({
      message: comment,
      comment_id: comms
    }),
  })

  await getComments(fileId)
  figma.ui.postMessage({ type: 'comment-added', data: await res.json() })
  return await res.json()
}


// const getAllTasks = async () => {
//   const res = await fetch('')
// }



// console.log("Checking figma.fileKey:", figma.fileKey)
// figma.ui.postMessage({ type: "user", data: getUser() })
// figma.ui.postMessage({ type: 'idd', data: figma.fileKey })
// figma.ui.postMessage({ type: 'load-comment', data: getComments() })
// figma.ui.postMessage({ type: 'load_files', data: getFiles() })


figma.ui.onmessage = async (msg: { type: string, data: any }) => {

  if (msg.type === 'access_token') {
    access_token = msg.data as string
    await figma.clientStorage.setAsync('token', access_token)
    // figma.ui.postMessage({ type: "user", data: getUser() })
    await getUser()
  }

  if (msg.type === 'comments') {
    await getComments(msg.data as string)
  }

  if (msg.type === 'file_id') {
    await getFiles(msg.data as string)
  }

  if (msg.type === 'add_comment') {
    await addComment(msg.data.comment, msg.data.commss, msg.data.fileId)
  }

  // figma.closePlugin();
};
