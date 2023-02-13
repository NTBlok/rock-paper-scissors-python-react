import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import { AxiosError } from "axios";

export interface Round {
  id: number;
  room_id: string;
  round_name: string;
  user_choice: string;
  player_choice: string;
  winner: string;
}

interface GameTableProps {
  player1: string | "Player 1" | undefined;
  player2: string | "Player 2" | undefined;
  rounds: Round[];
}

interface RoundsTableFromAPIProps {
  player1: string;
  player2: string;
  getData: Round[] | undefined;
  getLoading: boolean | undefined;
  getError: AxiosError<any, any> | null;
}

function GameTable({ player1, player2, rounds }: GameTableProps) {
  return (
    <Container
      style={{
        height: "15rem",
        width: "55rem",
        paddingTop: "3rem",
        textAlign: "center",
        overflowY: "scroll",
      }}
    >
      <Table striped bordered variant="dark">
        <thead>
          <tr>
            <th>Round</th>
            <th>{player1}</th>
            <th>{player2}</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((round) => (
            <tr>
              <td>{round.round_name}</td>
              <td>{round.user_choice}</td>
              <td>{round.player_choice}</td>
              <td>
                {round.winner}

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default function GameRoundsTableFromAPI({
  player1,
  player2,
  getData,
  getLoading,
  getError,
}: RoundsTableFromAPIProps) {
  if (getData) {
    const rounds: Round[] = getData.map((round) => ({
      id: round.id,
      room_id: round.room_id,
      round_name: round.round_name,
      user_choice: round.user_choice,
      player_choice: round.player_choice,
      winner:
        round.winner === "0"
          ? "No Winner"
          : round.winner === "1"
          ? player1
          : player2,
    }));
    return <GameTable player1={player1} player2={player2} rounds={rounds} />;
  }
  return null
}
