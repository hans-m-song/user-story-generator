data = JSON.parse(document.body.innerText)
data.cards
    .filter(card => !/^\s+$/.test(card.name) && /^\(\d+\)/.test(card.name))
    .map(card => {
        const body = card.name
            .replace(/^\(.*\)\s[A-Z]\.\d+|,/g, '')
            .replace(/\s+/g, ' ')
            .replace(/\si\s/g, ' I ')
            .trim()
        const bodyParts = body
            .replace(/^\(.*\)|[A-Z]\.\d+|,/g, '')
            .replace(/\s+/g, ' ')
            .split(/as a|i want|so that/ig)
            .filter(el => el !== '' && !/^\s+$/.test(el))
            .map(el => el.trim())
        const release = data.lists.find(el => el.id === card.idList).name;
        return {
            release: release.replace(/\(.*\)$/, ''),
            releaseDate: release.replace(/^.*\(.*\)\s\(|\)$/g, ''),
            uuid: card.id,
            id: card.name.replace(/\(.*\)|[a-zA-Z\s\/\.,']+$/g, '').trim(),
            points: card.name.replace(/\.*\(|\).*/g, ''),
            labels: card.labels.map(label => label.name),
            body,
            role: bodyParts[0],
            purpose: bodyParts[1],
            reason: bodyParts[2],
        }
    })
