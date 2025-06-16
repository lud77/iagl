export default (logger: any, pool: any) => {
  const fetchRateByRoute = async (route: string): Promise<number | null> => {
    const result = await pool.query(`
      select
        rate
      from
        ratesByRoute
      where
        route = $1
    `, [route]);

    if (result.rowCount === 0) {
      logger.info(`Route "${route}" not found`);
      return null;
    }

    logger.info(`Rate for route "${route}" loaded from db`, result.rows[0].rate);
    return result.rows[0].rate;
  };

  return { fetchRateByRoute };
};
