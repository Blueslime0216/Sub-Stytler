with open("output.txt", "w", encoding="utf-8") as file:
    for i in range(200):
        t_value = 1000 + i*10  # 각 줄의 t 값
        file.write(f'<p t="{t_value}" d="10" wp="0" ws="1"><s p="1">{i}</s></p>\n')
print("1000줄의 텍스트가 'output.txt' 파일에 저장되었습니다.")
