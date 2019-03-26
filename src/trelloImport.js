JSON.parse($0.innerText).cards.map(card => {
    const bodyParts = card.name
        .replace(/^\(.*\)|[A-Z]\.\d+/g, '')
        .split(/as a|i want|so that/ig)
        .filter(el => el !== '')
        .map(el => el.trim())
    return {
        uuid: card.id,
        id: card.name.replace(/\(.*\)|[a-zA-Z\s\/\.,']+$/g, '').trim(),
        points: card.name.replace(/\.*\(|\).*/g, ''),
        labels: card.labels.map(label => label.name),
        body: card.name.replace(/^\(.*\)|[A-Z]\.\d+/g, '').trim(),
        role: bodyParts[0],
        purpose: bodyParts[1],
        reason: bodyParts[2],
    }
}).filter(card => card.labels.length > 0 && /[A-Z]\.\d+/.test(card.id))
