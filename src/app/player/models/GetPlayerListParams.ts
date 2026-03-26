export interface GetPlayerListParams {
  sort?: {
    by: 'name' | 'score';
    order: 'asc' | 'desc';
  };
}
