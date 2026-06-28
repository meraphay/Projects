
// Moore FSM ? monitors ready, generates start
// S0 = IDLE, S1 = START, S2 = WAIT

module moore_fsm (
  input  clk,
  input  rst,
  input  ready,
  output reg start
);

  // state encoding
  parameter S0 = 2'b00;
  parameter S1 = 2'b01;
  parameter S2 = 2'b10;

  reg [1:0] CS, NS;

  // ?? CSL (state register) ??
  always @(posedge clk or posedge rst) begin
    if (rst)
      CS <= S0;
    else
      CS <= NS;
  end

  // ?? NSL (next state logic) ??
  always @(*) begin
    case (CS)
      S0: NS = ready ? S1 : S0;
      S1: NS = S2;
      S2: NS = ready ? S2 : S0;
      default: NS = S0;
    endcase
  end

  // ?? OPL (Moore output logic) ??
  always @(*) begin
    case (CS)
      S1: start = 1'b1;
      default: start = 1'b0;
    endcase
  end

endmodule