const neo4j = require('neo4j-driver');
async function deleteAll() {
    const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
    const session = driver.session();
    try {
      await session.run('MATCH (n) DETACH DELETE n');
      
     return 'Exclusão concluída com sucesso.'
    } catch (error) {
      return error  
      } finally {
      session.close();
      driver.close();
    }
}
async function deleteChecklist(id) {
  const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
  const session = driver.session();
  id = JSON.parse(id);

  id = parseInt(id.id )
  try {
    await session.run(`
      MATCH (c:Checklist {id: $id})
      OPTIONAL MATCH (c)-[:HAS_ITEM]->(item:Item)
      DETACH DELETE c, item
    `, { id: id });

    return 'Exclusão concluída com sucesso.';
  } catch (error) {
    return error;
  } finally {
    session.close();
    driver.close();
  }
}
async function deleteTask(dataItem) {
  const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
  const session = driver.session();
  const data = JSON.parse(dataItem);

  const itemId = parseInt(data.id);
  const listId = parseInt(data.listId);

  try {
    await session.run(`
      MATCH (c:Checklist {id: $listId})-[:HAS_ITEM]->(item:Item {id: $itemId})
      DETACH DELETE item
    `, { listId, itemId });

    return 'Exclusão concluída com sucesso.';
  } catch (error) {
    return error;
  } finally {
    session.close();
    driver.close();
  }
}
async function getAllChecklists() {
  const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
  const session = driver.session();
  
  try {
    const query = `
      MATCH (checklist:Checklist)
      OPTIONAL MATCH (checklist)-[:HAS_ITEM]->(item:Item)
      RETURN checklist, COLLECT(item) AS items
    `;

    const result = await session.run(query);
    const checklists = result.records.map(record => {
      const checklist = record.get('checklist').properties;
      checklist.items = record.get('items').map(item => item.properties);
      return checklist;
    });

    return checklists;
  } catch (error) {
    console.error(error);
    return error;
  } finally {
    session.close();
    driver.close();
  }
}
async function createChecklist(checklistData) {
  checklistData = JSON.parse(checklistData);
  const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
  const session = driver.session();

  try {
    const lastIdQuery = `
      MATCH (checklist:Checklist)
      RETURN MAX(checklist.id) AS maiorId
    `;

    const lastIdResult = await session.run(lastIdQuery);
    const lastId = lastIdResult.records[0].get('maiorId') || 0;
    const newId = lastId + 1;

    const query = `
      CREATE (checklist:Checklist {title: $title, id: $id, subtitle: $subtitle, items: [], completed: false})
      RETURN checklist
    `;

    const params = {
      title: checklistData.title,
      id: newId,
      subtitle: checklistData.subtitle
    };

    const result = await session.run(query, params);

    return result;
  } catch (error) {
    console.log(error);
    return 'Erro ao criar checklist!';
  } finally {
    session.close();
    driver.close();
  }
}
async function createTask(taskData) {
  taskData = JSON.parse(taskData);
  const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
  const session = driver.session();

  try {
    const getMaxItemIdQuery = `
      MATCH (item:Item)
      RETURN MAX(item.id) AS maxItemId
    `;

    const maxItemIdResult = await session.run(getMaxItemIdQuery);
    const maxItemId = maxItemIdResult.records[0].get('maxItemId') || 0;

    const newItemId = maxItemId + 1;

    const query = `
      MATCH (c:Checklist {id: $listId})
      CREATE (item:Item {id: $itemId, description: $description, completed: false}) 
      MERGE (c)-[:HAS_ITEM]->(item)
      RETURN c, item
    `;

    const params = {
      listId: taskData.listId,
      itemId: newItemId,
      description: taskData.description
    };

    const result = await session.run(query, params);

    return result;
  } catch (error) {
    console.log(error);
    return 'Erro ao criar Task!';
  } finally {
    session.close();
    driver.close();
  }
}
async function updateChecklist(checklistData) {
  const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
  const session = driver.session();

  try {
    const query = `
      MATCH (c:Checklist {id: $id})
      SET c.title = $title, c.subtitle = $subtitle, c.completed = $completed
      RETURN c
    `;

    const params = {
      id: checklistData.id,
      title: checklistData.title,
      subtitle: checklistData.subtitle,
      completed: checklistData.completed
    };

    const result = await session.run(query, params);
    const updatedChecklist = result.records[0].get('c').properties;

    if (checklistData.completed) {
      const updateItemsQuery = `
        MATCH (c:Checklist {id: $id})-[:HAS_ITEM]->(item:Item)
        SET item.completed = true
        RETURN c, item
      `;

      const updateItemsResult = await session.run(updateItemsQuery, { id: checklistData.id });

      return updatedChecklist;
    }

    return updatedChecklist;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar o checklist!');
  } finally {
    session.close();
    driver.close();
  }
}
async function updateChecklistItem(newChecklistData) {
  const driver = neo4j.driver('neo4j+s://5d438318.databases.neo4j.io', neo4j.auth.basic('neo4j', 's7lhySwU8SjH9jaPe5hrXPs112YQaXsWvRJhO8jzYT8'));
  const session = driver.session();

  try {
    const query = `
      MATCH (c:Checklist {id: $listId})-[:HAS_ITEM]->(item:Item {id: $id})
      SET item.description = $description, item.completed = $completed
      RETURN c
    `;

    const params = {
      listId: newChecklistData.listId,
      id: newChecklistData.id,
      description: newChecklistData.description,
      completed: newChecklistData.completed
    };

    const result = await session.run(query, params);
    const updatedChecklist = result.records[0].get('c').properties;

    return updatedChecklist;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar o checklist!');
  } finally {
    session.close();
    driver.close();
  }
}




module.exports= {
    deleteAll,
    getAllChecklists,
    deleteChecklist,
    createChecklist,
    updateChecklist,
    createTask,
    updateChecklistItem,
    deleteTask
}