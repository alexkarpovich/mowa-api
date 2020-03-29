class CyclesMeta {
  constructor(driver, trainingId) {
    this.driver = driver;
    this.trainingId = trainingId;
  }

  async collect() {
    const session = this.driver.session();

    const { records } = await session.run(`
      MATCH (stage:Stage)<-[:INCLUDES]-(train:Training{id: $id})-[:INCLUDES]->(set:Set)-[:INCLUDES]->(allTrans:Translation)
      WITH
        train.type as type,
        COLLECT(distinct stage) as stages,
        COUNT(distinct stage) as stagesCount,
        COUNT(distinct allTrans) as totalTrans
      UNWIND stages as stg
      MATCH (stg)-[:INCLUDES]->(cycle:Cycle)
      OPTIONAL MATCH (stg)-[:HAS_COMPLETED]->(completeTrans:Translation)
      WITH
        type,
        totalTrans,
        stagesCount,
        stg.id as stageId,
        COUNT(distinct cycle) as cyclesCount,
        COUNT(distinct completeTrans) as completeCount
      RETURN {
        type: type,
        total: totalTrans * stagesCount,
        complete: sum(completeCount),
        stages: collect({
          id: stageId,
          cycles: cyclesCount,
          complete: completeCount
        })
      } as meta
    `, { id: this.trainingId });

    const meta = records[0].get('meta');

    return {
      type: +meta.type,
      total: +meta.total,
      complete: +meta.complete,
      stages: meta.stages.map(stage => {
        stage.id = +stage.id;
        stage.cycles = +stage.cycles;
        stage.complete = +stage.complete;

        return stage;
      })
    };
  }
}

module.exports = CyclesMeta;
