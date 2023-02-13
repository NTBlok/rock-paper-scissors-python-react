import useAxios from "axios-hooks";
import { APIURL } from "../common/Constants";

interface UseRoomGetProps {
  id: string;
  player1: string;
  player1socket: string;
  player2: string;
  player2socket: string;
  player2status: string;
}

export const useRoom = ({ roomId, token }:{roomId: string | undefined; token:string | null;}) => {
  const [
    { data: roomData, loading: getRoomLoading, error: getRoomError },
    refetchGet,
  ] = useAxios<UseRoomGetProps>({
        url: APIURL + `/room/${roomId}`,
        headers: {
          Authorization: "Bearer " + token,
        }
      });
  const getRoomData = () => {
    refetchGet();
  };

  return { getRoomData, roomData, getRoomLoading, getRoomError };
};


interface UseScoreGetProps {
  player1: number;
  player2: number;
}

export const useScore = ({ roomId, token}:{roomId: string | undefined; token:string | null;}) => {
  const [
    { data: scoreData, loading: getScoreLoading, error: getScoreError },
    refetchGet,
  ] = useAxios<UseScoreGetProps>({
    url: APIURL + `/wins/${roomId}`,
    headers: {
      Authorization: "Bearer " + token,
    }
  });
  const getScoreData = () => {
    refetchGet();
  };

  return { getScoreData, scoreData, getScoreLoading, getScoreError };
};