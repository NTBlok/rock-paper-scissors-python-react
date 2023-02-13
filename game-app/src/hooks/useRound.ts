import useAxios from "axios-hooks";
import { APIURL } from "../common/Constants";
import { Round } from '../components/GameRoundsTableFromAPI';


export const useRounds = ({ roomId, token }:{roomId: string | undefined; token:string | null;}) => {
  const [
    { data: roundsData, loading: getRoundsLoading, error: getRoundsError },
    refetchGet,
  ] = useAxios<Round[]>({
        url: APIURL + `/rounds/${roomId}`,
        headers: {
          Authorization: "Bearer " + token,
        }
      });
  const getRoundsData = () => {
    refetchGet();
  };

  return { getRoundsData, roundsData, getRoundsLoading, getRoundsError };
};

