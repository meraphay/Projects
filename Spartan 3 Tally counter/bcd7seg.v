// ============================================================
// Module : bcd7seg
// Function: BCD to 7-Segment decoder
//           Common Anode display - Active Low (0 = segment ON)
//           Input : 4-bit BCD input (selected BCD digit from Top_dispSel)
//           Output: 7-bit seg7_out {a,b,c,d,e,f,g} active low
// Method  : SMD combinational output logic
// Spartan-3 Segment pins (Active Low):
//   seg7_out[6] = a = E14
//   seg7_out[5] = b = G13
//   seg7_out[4] = c = N15
//   seg7_out[3] = d = P15
//   seg7_out[2] = e = R16
//   seg7_out[1] = f = F13
//   seg7_out[0] = g = N16
// ============================================================

module bcd7seg (
    input  wire [3:0] bcd_in,    // 4-bit BCD from Top_dispSel
    output reg  [6:0] seg7_out   // 7-bit {a,b,c,d,e,f,g} active low
);

    // ============================================================
    // OPL - Output Logic (Pure Combinational)
    // seg7_out = {a, b, c, d, e, f, g}
    // Common Anode: 0 = segment ON, 1 = segment OFF
    // ============================================================
    always @(*) begin
        case (bcd_in)
            //               {a,b,c,d,e,f,g}
            4'd0: seg7_out = 7'b0000001;  // a,b,c,d,e,f ON  | g OFF
            4'd1: seg7_out = 7'b1001111;  // b,c ON
            4'd2: seg7_out = 7'b0010010;  // a,b,d,e,g ON
            4'd3: seg7_out = 7'b0000110;  // a,b,c,d,g ON
            4'd4: seg7_out = 7'b1001100;  // b,c,f,g ON
            4'd5: seg7_out = 7'b0100100;  // a,c,d,f,g ON
            4'd6: seg7_out = 7'b0100000;  // a,c,d,e,f,g ON
            4'd7: seg7_out = 7'b0001111;  // a,b,c ON
            4'd8: seg7_out = 7'b0000000;  // all ON
            4'd9: seg7_out = 7'b0000100;  // a,b,c,d,f,g ON
            default: seg7_out = 7'b1111111; // all OFF
        endcase
    end

endmodule
