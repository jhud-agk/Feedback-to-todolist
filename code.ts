

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width: 450, height:700});


const getComments = async () => {
  const res = await fetch(`https://api.figma.com/v1/files/eNDMTZhqPS1wYSkLMSaovC/comments`, {
    headers: {
      "Content-Type": "application/json",
      
  },
  })
  
  console.log(await res.json())
  figma.ui.postMessage({ type: 'get-comment', data: await res.json() })
  
  return await res.json()
}

const getFiles = async () => {
  const res = await fetch(`https://api.figma.com/v1/files/eNDMTZhqPS1wYSkLMSaovC`, {
    headers: {
      "Content-Type": "application/json",
      
  },
  })
  
  console.log(await res.json())
  figma.ui.postMessage({ type: 'get-files', data: await res.json() })
  
  return await res.json()
}



console.log("Checking figma.fileKey:", figma.fileKey)
figma.ui.postMessage({ type: 'idd', data: figma.fileKey })
figma.ui.postMessage({ type: 'load-comment', data: getComments() })
figma.ui.postMessage({type: 'load_files', data: getFiles() })

figma.ui.onmessage =  (msg: {type: string, count: number}) => {
  if (msg.type === 'create-shapes') {
    // This plugin creates rectangles on the screen.
    const numberOfRectangles = msg.count;

    const nodes: SceneNode[] = [];
    for (let i = 0; i < numberOfRectangles; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  figma.closePlugin();
};
