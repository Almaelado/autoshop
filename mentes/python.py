import random

with open("fasz.txt", "r", encoding="utf-8") as file:
    tartalom = file.read()
    darabolt = tartalom.strip().split("\t")

    darabolt = [x for x in darabolt if x != ""]

    for i in range(len(darabolt)):
        darabolt[i] = darabolt[i].replace('\n', "")

marka=["Mahindra","Hyundai","Tata","Honda","Ford","Maruti","KIA","MG","Renault","Volkswagen","Nissan","Skoda","Toyota","Datsun","Jeep"]
uzemanyag=["Diesel","Petrol","CNG","Electric"] 
valto=["Manual","Automatic"]
for i in range(10,len(darabolt),10):
    darabolt[i]= marka.index(darabolt[i])+1
    darabolt[i+4]= uzemanyag.index(darabolt[i+4])+1
    darabolt[i+2]= valto.index(darabolt[i+2])+1

with open("fasz3.txt","w",encoding="utf-8") as file2:
    hely=1
    szamlalo=1
    run = False
    file2.write("Insert into autok (id,marka_id,model,valto_id,kiadasiev,uzemanyag_id,motormeret,km,ar,ajtoszam,szemelyek,szin_id) VALUES \n (")
    print("Insert into autok (id,marka_id,model,valto_id,kiadasiev,uzemanyag_id,motormeret,km,ar,ajtoszam,szemelyek) VALUES \n (")
    for i in range(1,len(darabolt)):
        rand = random.randint(1,10)
        if i==10:
            run=True
            hely=1
        if run ==True:
            if hely==1:
                file2.write(str(szamlalo))
                szamlalo+=1
            if hely==2:
                file2.write(",'"+str(darabolt[i])+"'")
            else:
                file2.write(","+str(darabolt[i]))
            if hely == 10:
                file2.write(","+str(rand)+"),\n(")
                hely=0
        hely+=1
print("Program Vége")
        
